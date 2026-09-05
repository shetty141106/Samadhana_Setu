package com.samadhansetu.controller;
import com.samadhansetu.Service.UniversityRoutingService; import com.samadhansetu.dto.UniversityRoutingResponseDto; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/universities/routing") @RequiredArgsConstructor public class UniversityRoutingController{private final UniversityRoutingService service;@GetMapping public List<UniversityRoutingResponseDto> route(@RequestParam String category){return service.route(category);}}
