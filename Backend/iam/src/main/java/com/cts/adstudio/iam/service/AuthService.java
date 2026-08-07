package com.cts.adstudio.iam.service;

import com.cts.adstudio.iam.dto.request.LoginRequest;
import com.cts.adstudio.iam.dto.request.RegisterRequest;
import com.cts.adstudio.iam.dto.response.LoginResponse;
import com.cts.adstudio.iam.dto.response.UserResponse;
import com.cts.adstudio.iam.entity.User;
import com.cts.adstudio.iam.enums.Role;
import com.cts.adstudio.iam.enums.UserStatus;

import java.util.List;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    List<String> getEligibleModules(Role role);

    List<User> getAllUsers();

    void updateStatus(Long userId, UserStatus status);

}
