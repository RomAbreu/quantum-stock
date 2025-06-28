package org.example.backend.services;

import jakarta.ws.rs.core.Response;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.KeycloakUserRequest;
import org.example.backend.util.KeycloakProvider;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class KeycloakService {
    private final KeycloakProvider keycloakProvider;

    public int createUser(KeycloakUserRequest userRequest) {
        UsersResource usersResource = keycloakProvider.getUserResource();

        UserRepresentation userRepresentation = new UserRepresentation();

        userRepresentation.setUsername(userRequest.getUsername());
        userRepresentation.setFirstName(userRequest.getUsername());
        userRepresentation.setLastName(userRequest.getUsername());
        userRepresentation.setEmail(userRequest.getEmail());
        userRepresentation.setEnabled(true);
        userRepresentation.setEmailVerified(true);

        Response response = usersResource.create(userRepresentation);

        if (response.getStatus() == 201) {
            String path = response.getLocation().getPath();
            String userId = path.substring(path.lastIndexOf('/') + 1);

            CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
            credentialRepresentation.setTemporary(false);
            credentialRepresentation.setType(OAuth2Constants.PASSWORD);
            credentialRepresentation.setValue(userRequest.getPassword());

            usersResource.get(userId).resetPassword(credentialRepresentation);

            RealmResource realmResource = keycloakProvider.getRealmResource();

            String id = realmResource.clients().findByClientId("quantum-stock-backend").getFirst().getId();

            List<RoleRepresentation> roleRepresentations = realmResource.clients().get(id)
                    .roles()
                    .list()
                    .stream()
                    .filter(role -> role.getName().equals(userRequest.getRole()))
                    .toList();

            realmResource
                    .users()
                    .get(userId)
                    .roles()
                    .clientLevel(id)
                    .add(roleRepresentations);
        }

        return response.getStatus();
    }

    public List<UserRepresentation> getAllUsers() {
        UsersResource usersResource = keycloakProvider.getUserResource();
        return usersResource.list();
    }
}
