package com.samadhansetu.Repository;

import com.samadhansetu.model.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByProjectId(Long projectId);
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);
}
