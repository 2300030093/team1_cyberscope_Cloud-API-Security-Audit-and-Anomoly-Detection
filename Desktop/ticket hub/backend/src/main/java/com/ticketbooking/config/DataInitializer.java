package com.ticketbooking.config;

import com.ticketbooking.model.Role;
import com.ticketbooking.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(Role.RoleName.USER);
            roleRepository.save(userRole);
            
            Role adminRole = new Role();
            adminRole.setName(Role.RoleName.ADMIN);
            roleRepository.save(adminRole);
            
            System.out.println("Initialized roles: USER, ADMIN");
        }
    }
}

