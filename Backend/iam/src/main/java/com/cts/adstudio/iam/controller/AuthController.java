package com.cts.adstudio.iam.controller;

import com.cts.adstudio.iam.dto.request.LoginRequest;
import com.cts.adstudio.iam.dto.request.RegisterRequest;
import com.cts.adstudio.iam.dto.response.LoginResponse;
import com.cts.adstudio.iam.dto.response.UserResponse;
import com.cts.adstudio.iam.entity.User;
import com.cts.adstudio.iam.enums.Role;
import com.cts.adstudio.iam.enums.UserStatus;
import com.cts.adstudio.iam.security.CustomUserDetails;
import com.cts.adstudio.iam.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Story: User Registration API + Login API.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration and login")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @Operation(summary = "Authenticate a user and issue a JWT")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    @GetMapping("/eligibility-list")
    public ResponseEntity<List<String>> getEligibilityList(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        // Assuming your UserDetails/principal exposes the Role enum.
        // Adjust the cast below to match your actual principal class.
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Role role = userDetails.getUser().getRole();

        List<String> eligibleModules = authService.getEligibleModules(role);

        return ResponseEntity.ok(eligibleModules);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        // Assuming your UserDetails/principal exposes the Role enum.
        // Adjust the cast below to match your actual principal class.
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        if(userDetails == null){
            return ResponseEntity.status(401).build();
        }
        Role role = userDetails.getUser().getRole();

        if(role==Role.ADMIN) {
            List<User> users = authService.getAllUsers();
            return ResponseEntity.ok(users);
        }

        return ResponseEntity.status(401).build(); // UnAuthorized if not admin
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long userId,
            @RequestParam UserStatus status) {

        authService.updateStatus(userId, status);

        return ResponseEntity.noContent().build();
    }
}
