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
 private final IssueRepository issueRepository;
 private final RestClient restClient = RestClient.builder().build();
 @Value("${ai.service.url:}") private String aiServiceUrl;

 public AiProcessResponse processIssue(Long issueId){
  Issue i=issueRepository.findById(issueId).orElseThrow(()->new IllegalArgumentException("Issue not found: "+issueId));
  AiProcessResponse r=process(AiProcessRequest.builder().title(i.getTitle()).description(i.getDescription()).location(i.getLocation()).build());
  r.setIssueId(issueId); return r;
 }
 public AiProcessResponse process(AiProcessRequest request){
  if(aiServiceUrl!=null && !aiServiceUrl.isBlank()){
   try { AiProcessResponse external=restClient.post().uri(aiServiceUrl).contentType(MediaType.APPLICATION_JSON).body(request).retrieve().body(AiProcessResponse.class); if(external!=null){external.setSource("PYTHON_AI"); return external;} }
   catch(Exception ignored) { }
  }
  String text=((request.getTitle()==null?"":request.getTitle())+" "+(request.getDescription()==null?"":request.getDescription())).toLowerCase(Locale.ROOT);
  String category="Public Administration"; double confidence=.55;
  Map<String,String[]> rules=new LinkedHashMap<>();
  rules.put("Education",new String[]{"school","college","teacher","student","education","विद्यालय","शिक्षा"});
  rules.put("Agriculture",new String[]{"crop","farmer","farm","irrigation","agriculture","किसान","फसल"});
  rules.put("Healthcare",new String[]{"hospital","health","doctor","medicine","clinic","स्वास्थ्य","अस्पताल"});
  rules.put("Water Resources",new String[]{"water","drinking water","well","river","pipeline","पानी","जल"});
  rules.put("Environment",new String[]{"pollution","waste","garbage","forest","environment","प्रदूषण","कचरा"});
  rules.put("Energy",new String[]{"electricity","power","transformer","street light","energy","बिजली"});
  rules.put("Urban Development",new String[]{"road","drainage","traffic","sewer","municipal","शहरी","सड़क"});
  rules.put("Accessibility",new String[]{"wheelchair","disabled","ramp","accessibility","दिव्यांग"});
  rules.put("Rural Livelihoods",new String[]{"livelihood","self help","employment","rural","handicraft","रोजगार"});
  int best=0; for(var e:rules.entrySet()){int hits=0; for(String k:e.getValue()) if(text.contains(k)) hits++; if(hits>best){best=hits;category=e.getKey();confidence=Math.min(.95,.60+.12*hits);}}
  Long duplicate=findDuplicate(request);
  String summary=makeSummary(request.getDescription());
  return AiProcessResponse.builder().translatedText(request.getDescription()).summary(summary).category(category).confidence(confidence).duplicateIssueId(duplicate).source("RULE_BASED_FALLBACK").build();
 }
 private Long findDuplicate(AiProcessRequest r){
  String incoming=normalize((r.getTitle()==null?"":r.getTitle())+" "+(r.getDescription()==null?"":r.getDescription())); if(incoming.isBlank())return null;
  Set<String> words=new HashSet<>(Arrays.asList(incoming.split(" "))); if(words.isEmpty())return null;
  for(Issue i:issueRepository.findAll()){
   String existing=normalize((i.getTitle()==null?"":i.getTitle())+" "+(i.getDescription()==null?"":i.getDescription())); Set<String> ew=new HashSet<>(Arrays.asList(existing.split(" "))); if(ew.isEmpty())continue;
   Set<String> intersection=new HashSet<>(words); intersection.retainAll(ew); Set<String> union=new HashSet<>(words); union.addAll(ew);
   if(!union.isEmpty() && (double)intersection.size()/union.size()>=.70) return i.getId();
  } return null;
 }
 private String normalize(String s){return s.toLowerCase(Locale.ROOT).replaceAll("[^\\p{L}\\p{N} ]"," ").replaceAll("\\s+"," ").trim();}
 private String makeSummary(String d){if(d==null||d.isBlank())return "No description provided."; String clean=d.replaceAll("\\s+"," ").trim(); return clean.length()<=240?clean:clean.substring(0,237)+"...";}
}
