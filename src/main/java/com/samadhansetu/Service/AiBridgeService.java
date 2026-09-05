package com.samadhansetu.Service;

import com.samadhansetu.Repository.IssueRepository;
import com.samadhansetu.dto.*;
import com.samadhansetu.model.entity.Issue;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.*;

@Service @RequiredArgsConstructor
public class AiBridgeService {
 private final IssueRepository issueRepository; private final UniversityRoutingService universityRoutingService; private final RestClient restClient=RestClient.builder().build();
 @Value("${ai.service.url:}") private String aiServiceUrl;
 public AiProcessResponse processIssue(Long issueId){Issue issue=issueRepository.findById(issueId).orElseThrow(()->new IllegalArgumentException("Issue not found: "+issueId));AiProcessResponse r=process(AiProcessRequest.builder().title(issue.getTitle()).description(issue.getDescription()).location(issue.getLocation()).build());r.setIssueId(issueId);if(r.getCategory()!=null){issue.setCategory(r.getCategory());issueRepository.save(issue);}return r;}
 public AiProcessResponse process(AiProcessRequest request){
  if(aiServiceUrl!=null&&!aiServiceUrl.isBlank())try{AiProcessResponse e=restClient.post().uri(aiServiceUrl).contentType(MediaType.APPLICATION_JSON).body(request).retrieve().body(AiProcessResponse.class);if(e!=null){e.setSource("PYTHON_AI");enrichUniversityRecommendation(e);return e;}}catch(Exception ignored){}
  String text=((request.getTitle()==null?"":request.getTitle())+" "+(request.getDescription()==null?"":request.getDescription())).toLowerCase(Locale.ROOT);String category="Public Administration";double confidence=.55;
  Map<String,String[]> rules=new LinkedHashMap<>();rules.put("Education",new String[]{"school","college","teacher","student","education","विद्यालय","शिक्षा"});rules.put("Agriculture",new String[]{"crop","farmer","farm","irrigation","agriculture","किसान","फसल"});rules.put("Healthcare",new String[]{"hospital","health","doctor","medicine","clinic","स्वास्थ्य","अस्पताल"});rules.put("Water Resources",new String[]{"water","drinking water","well","river","pipeline","पानी","जल"});rules.put("Environment",new String[]{"pollution","waste","garbage","forest","environment","प्रदूषण","कचरा"});rules.put("Energy",new String[]{"electricity","power","transformer","street light","energy","बिजली"});rules.put("Urban Development",new String[]{"road","drainage","traffic","sewer","municipal","शहरी","सड़क"});rules.put("Accessibility",new String[]{"wheelchair","disabled","ramp","accessibility","दिव्यांग"});rules.put("Rural Livelihoods",new String[]{"livelihood","self help","employment","rural","handicraft","रोजगार"});int best=0;for(var e:rules.entrySet()){int hits=0;for(String k:e.getValue())if(text.contains(k))hits++;if(hits>best){best=hits;category=e.getKey();confidence=Math.min(.95,.60+.12*hits);}}
  AiProcessResponse r=AiProcessResponse.builder().translatedText(request.getDescription()).summary(makeSummary(request.getDescription())).category(category).confidence(confidence).duplicateIssueId(findDuplicate(request)).source("RULE_BASED_FALLBACK").build();enrichUniversityRecommendation(r);return r;
 }
 private void enrichUniversityRecommendation(AiProcessResponse r){if(r.getCategory()==null||r.getCategory().isBlank())return;List<UniversityRoutingResponseDto> x=universityRoutingService.route(r.getCategory());if(!x.isEmpty()){r.setRecommendedUniversityId(x.get(0).getUniversityId());r.setRecommendedUniversityName(x.get(0).getUniversityName());}}
 private Long findDuplicate(AiProcessRequest r){String in=normalize((r.getTitle()==null?"":r.getTitle())+" "+(r.getDescription()==null?"":r.getDescription()));if(in.isBlank())return null;Set<String>w=new HashSet<>(Arrays.asList(in.split(" ")));for(Issue i:issueRepository.findAll()){Set<String>e=new HashSet<>(Arrays.asList(normalize((i.getTitle()==null?"":i.getTitle())+" "+(i.getDescription()==null?"":i.getDescription())).split(" ")));if(e.isEmpty())continue;Set<String>a=new HashSet<>(w);a.retainAll(e);Set<String>u=new HashSet<>(w);u.addAll(e);if(!u.isEmpty()&&(double)a.size()/u.size()>=.70)return i.getId();}return null;}
 private String normalize(String v){return v.toLowerCase(Locale.ROOT).replaceAll("[^\\p{L}\\p{N} ]"," ").replaceAll("\\s+"," ").trim();}
 private String makeSummary(String d){if(d==null||d.isBlank())return "No description provided.";String c=d.replaceAll("\\s+"," ").trim();return c.length()<=240?c:c.substring(0,237)+"...";}
}
