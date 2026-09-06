package com.samadhansetu.Service;

import com.samadhansetu.Repository.IndustryRepository;
import com.samadhansetu.Repository.OrganizationRepository;
import com.samadhansetu.model.entity.Industry;
import com.samadhansetu.model.entity.Organization;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.Map;

@Service @RequiredArgsConstructor
public class VerificationService {
    private final OrganizationRepository organizations;
    private final IndustryRepository industries;

    public Map<String,Object> verify(Long id) {
        Organization o = organizations.findById(id).orElseThrow(() -> new IllegalArgumentException("Organization not found: " + id));
        if (!isAdmin()) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Industry industry = authentication == null ? null : industries.findByUserEmail(authentication.getName()).orElse(null);
            if (industry == null || industry.getOrganization() == null || !id.equals(industry.getOrganization().getId())) {
                throw new IllegalArgumentException("You can only verify your own industry organization");
            }
        }
        boolean identity = o.getName() != null && !o.getName().isBlank();
        boolean registration = (o.getCin() != null && !o.getCin().isBlank()) || (o.getGstin() != null && !o.getGstin().isBlank()) || (o.getUdyam() != null && !o.getUdyam().isBlank());
        Map<String,Object> r = new LinkedHashMap<>();
        r.put("organizationId", o.getId());
        r.put("organizationName", o.getName());
        r.put("identityPresent", identity);
        r.put("registrationIdentifierPresent", registration);
        r.put("verified", identity && registration);
        r.put("message", identity && registration ? "Organization has the minimum verification identifiers for manual verification." : "Organization must provide a name and at least one registration identifier.");
        return r;
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
}
