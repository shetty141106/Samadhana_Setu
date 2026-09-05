package com.samadhansetu.Service;

import com.samadhansetu.Repository.OrganizationRepository;
import com.samadhansetu.model.entity.Organization;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.Map;

@Service @RequiredArgsConstructor
public class VerificationService {
 private final OrganizationRepository organizations;
 public Map<String,Object> verify(Long id){Organization o=organizations.findById(id).orElseThrow(()->new IllegalArgumentException("Organization not found: "+id));boolean identity=o.getName()!=null&&!o.getName().isBlank();boolean registration=o.getCin()!=null&&!o.getCin().isBlank()||o.getGstin()!=null&&!o.getGstin().isBlank()||o.getUdyam()!=null&&!o.getUdyam().isBlank();Map<String,Object>r=new LinkedHashMap<>();r.put("organizationId",o.getId());r.put("organizationName",o.getName());r.put("identityPresent",identity);r.put("registrationIdentifierPresent",registration);r.put("verified",identity&&registration);r.put("message",identity&&registration?"Organization has the minimum verification identifiers for manual verification.":"Organization must provide a name and at least one registration identifier.");return r;}
}
