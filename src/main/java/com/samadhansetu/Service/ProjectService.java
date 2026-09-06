package com.samadhansetu.Service;

import com.samadhansetu.Repository.*;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.*;
import com.samadhansetu.model.enums.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projects;
    private final UniversityRepository universities;
    private final TeamMemberRepository members;
    private final MilestoneRepository milestones;
    private final TaskRepository tasks;
    private final UserRepository users;

    @Transactional
    public ProjectResponseDto create(ProjectRequestDto r, Authentication authentication) {
        assertStaff(authentication);
        Project p = Project.builder().title(r.getTitle()).description(r.getDescription())
                .status(r.getStatus()==null?ProjectStatus.PLANNED:r.getStatus()).build();
        if(r.getUniversityId()!=null) p.setUniversity(universities.findById(r.getUniversityId())
                .orElseThrow(()->new IllegalArgumentException("University not found: "+r.getUniversityId())));
        Project saved = projects.save(p);
        if (hasRole(authentication, "FACULTY")) {
            User creator = currentUser(authentication);
            members.save(TeamMember.builder().project(saved).user(creator).memberRole("FACULTY").build());
        }
        return map(saved);
    }

    public ProjectResponseDto get(Long id){return map(find(id));}
    public List<ProjectResponseDto> all(){return projects.findAll().stream().map(this::map).toList();}
    public List<ProjectResponseDto> byUniversity(Long id){return projects.findByUniversityId(id).stream().map(this::map).toList();}
    public List<ProjectResponseDto> byStatus(ProjectStatus s){return projects.findByStatus(s).stream().map(this::map).toList();}

    public ProjectResponseDto update(Long id,ProjectRequestDto r, Authentication authentication){
        Project p=find(id); assertProjectMutationAccess(p, authentication);
        p.setTitle(r.getTitle()); p.setDescription(r.getDescription());
        if(r.getStatus()!=null)p.setStatus(r.getStatus());
        if(r.getUniversityId()!=null)p.setUniversity(universities.findById(r.getUniversityId())
                .orElseThrow(()->new IllegalArgumentException("University not found: "+r.getUniversityId())));
        return map(projects.save(p));
    }

    public void delete(Long id, Authentication authentication){
        Project p=find(id); assertProjectMutationAccess(p, authentication); projects.delete(p);
    }

    public TeamMemberResponseDto addMember(Long projectId,TeamMemberRequestDto r, Authentication authentication){
        Project p=find(projectId); assertProjectMutationAccess(p, authentication);
        User u=users.findById(r.getUserId()).orElseThrow(()->new IllegalArgumentException("User not found: "+r.getUserId()));
        if(members.existsByProjectIdAndUserId(projectId,r.getUserId()))throw new IllegalArgumentException("User already belongs to project");
        return memberMap(members.save(TeamMember.builder().project(p).user(u).memberRole(r.getMemberRole()).build()));
    }

    public List<TeamMemberResponseDto> members(Long id){return members.findByProjectId(id).stream().map(this::memberMap).toList();}

    public void removeMember(Long id, Authentication authentication){
        TeamMember member=members.findById(id).orElseThrow(()->new IllegalArgumentException("Team member not found: "+id));
        assertProjectMutationAccess(member.getProject(), authentication); members.delete(member);
    }

    public MilestoneResponseDto addMilestone(Long projectId,MilestoneRequestDto r, Authentication authentication){
        Project p=find(projectId); assertProjectMutationAccess(p, authentication);
        Milestone m=Milestone.builder().project(p).title(r.getTitle()).startDate(r.getStartDate()).endDate(r.getEndDate())
                .status(r.getStatus()==null?MilestoneStatus.PENDING:r.getStatus()).build();
        return milestoneMap(milestones.save(m));
    }

    public List<MilestoneResponseDto> milestones(Long id){return milestones.findByProjectId(id).stream().map(this::milestoneMap).toList();}

    public MilestoneResponseDto updateMilestone(Long id,MilestoneRequestDto r, Authentication authentication){
        Milestone m=milestones.findById(id).orElseThrow(()->new IllegalArgumentException("Milestone not found: "+id));
        assertProjectMutationAccess(m.getProject(), authentication);
        if(r.getTitle()!=null)m.setTitle(r.getTitle()); if(r.getStartDate()!=null)m.setStartDate(r.getStartDate());
        if(r.getEndDate()!=null)m.setEndDate(r.getEndDate()); if(r.getStatus()!=null)m.setStatus(r.getStatus());
        return milestoneMap(milestones.save(m));
    }

    public TaskResponseDto addTask(Long projectId,TaskRequestDto r, Authentication authentication){
        Project p=find(projectId); assertProjectMutationAccess(p, authentication);
        Task t=Task.builder().project(p).title(r.getTitle()).description(r.getDescription()).dueDate(r.getDueDate())
                .status(r.getStatus()==null?TaskStatus.TODO:r.getStatus()).build();
        if(r.getMilestoneId()!=null)t.setMilestone(findMilestoneForProject(r.getMilestoneId(),projectId));
        if(r.getAssignedToId()!=null)t.setAssignedTo(findProjectMember(projectId,r.getAssignedToId()));
        return taskMap(tasks.save(t));
    }

    public List<TaskResponseDto> tasks(Long id){return tasks.findByProjectId(id).stream().map(this::taskMap).toList();}

    public TaskResponseDto updateTask(Long id,TaskRequestDto r, Authentication authentication){
        Task t=tasks.findById(id).orElseThrow(()->new IllegalArgumentException("Task not found: "+id));
        Project project=t.getProject();

        // Students may advance/reverse the status of tasks assigned to them, but may not
        // edit project structure, task ownership, title, dates, or milestone assignment.
        if (hasRole(authentication, "STUDENT")) {
            assertStudentTaskStatusAccess(t, authentication);
            if (r.getStatus() != null) t.setStatus(r.getStatus());
            return taskMap(tasks.save(t));
        }

        assertProjectMutationAccess(project, authentication);
        t.setTitle(r.getTitle()); t.setDescription(r.getDescription()); t.setDueDate(r.getDueDate());
        if(r.getStatus()!=null)t.setStatus(r.getStatus());
        t.setMilestone(r.getMilestoneId()==null?null:findMilestoneForProject(r.getMilestoneId(),project.getId()));
        t.setAssignedTo(r.getAssignedToId()==null?null:findProjectMember(project.getId(),r.getAssignedToId()));
        return taskMap(tasks.save(t));
    }

    public void deleteTask(Long id, Authentication authentication){
        Task t=tasks.findById(id).orElseThrow(()->new IllegalArgumentException("Task not found: "+id));
        assertProjectMutationAccess(t.getProject(), authentication); tasks.delete(t);
    }

    private void assertStaff(Authentication authentication){
        if(authentication==null || !(hasRole(authentication,"ADMIN") || hasRole(authentication,"NODAL_OFFICER") || hasRole(authentication,"FACULTY")))
            throw new AccessDeniedException("Insufficient role for project management");
    }

    private void assertProjectMutationAccess(Project project, Authentication authentication){
        assertStaff(authentication);
        if(hasRole(authentication,"ADMIN") || hasRole(authentication,"NODAL_OFFICER")) return;
        User current=currentUser(authentication);
        if(!members.existsByProjectIdAndUserId(project.getId(), current.getId()))
            throw new AccessDeniedException("Faculty can only modify projects they belong to");
    }

    private void assertStudentTaskStatusAccess(Task task, Authentication authentication){
        if(authentication==null || !hasRole(authentication,"STUDENT"))
            throw new AccessDeniedException("Student task access requires a student account");
        User current=currentUser(authentication);
        if(task.getAssignedTo()==null || !current.getId().equals(task.getAssignedTo().getId()))
            throw new AccessDeniedException("Students can only update the status of tasks assigned to them");
    }

    private boolean hasRole(Authentication authentication, String role){
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> ("ROLE_"+role).equals(a.getAuthority()));
    }

    private User currentUser(Authentication authentication){
        if(authentication==null || authentication.getName()==null || authentication.getName().isBlank())
            throw new AccessDeniedException("Authentication required");
        return users.findByEmail(authentication.getName())
                .orElseThrow(()->new AccessDeniedException("Authenticated user not found"));
    }

    private Project find(Long id){return projects.findById(id).orElseThrow(()->new IllegalArgumentException("Project not found: "+id));}
    private Milestone findMilestoneForProject(Long milestoneId,Long projectId){
        Milestone milestone=milestones.findById(milestoneId).orElseThrow(()->new IllegalArgumentException("Milestone not found: "+milestoneId));
        if(!milestone.getProject().getId().equals(projectId))throw new IllegalArgumentException("Milestone does not belong to project: "+projectId);
        return milestone;
    }
    private User findProjectMember(Long projectId,Long userId){
        User user=users.findById(userId).orElseThrow(()->new IllegalArgumentException("User not found: "+userId));
        if(!members.existsByProjectIdAndUserId(projectId,userId))throw new IllegalArgumentException("Assigned user is not a member of project: "+projectId);
        return user;
    }
    private ProjectResponseDto map(Project p){return ProjectResponseDto.builder().id(p.getId()).title(p.getTitle()).description(p.getDescription()).status(p.getStatus()).universityId(p.getUniversity()==null?null:p.getUniversity().getId()).universityName(p.getUniversity()==null?null:p.getUniversity().getName()).teamSize(members.findByProjectId(p.getId()).size()).milestoneCount(milestones.findByProjectId(p.getId()).size()).taskCount(tasks.findByProjectId(p.getId()).size()).build();}
    private TeamMemberResponseDto memberMap(TeamMember m){return TeamMemberResponseDto.builder().id(m.getId()).projectId(m.getProject().getId()).userId(m.getUser().getId()).userName(m.getUser().getName()).memberRole(m.getMemberRole()).build();}
    private MilestoneResponseDto milestoneMap(Milestone m){return MilestoneResponseDto.builder().id(m.getId()).projectId(m.getProject().getId()).title(m.getTitle()).startDate(m.getStartDate()).endDate(m.getEndDate()).status(m.getStatus()).taskCount(tasks.findByMilestoneId(m.getId()).size()).build();}
    private TaskResponseDto taskMap(Task t){return TaskResponseDto.builder().id(t.getId()).projectId(t.getProject().getId()).milestoneId(t.getMilestone()==null?null:t.getMilestone().getId()).assignedToId(t.getAssignedTo()==null?null:t.getAssignedTo().getId()).assignedToName(t.getAssignedTo()==null?null:t.getAssignedTo().getName()).title(t.getTitle()).description(t.getDescription()).dueDate(t.getDueDate()).status(t.getStatus()).build();}
}
