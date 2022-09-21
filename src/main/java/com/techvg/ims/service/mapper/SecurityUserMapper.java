package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.SecurityPermission;
import com.techvg.ims.domain.SecurityRole;
import com.techvg.ims.domain.SecurityUser;
import com.techvg.ims.domain.WareHouse;
import com.techvg.ims.service.dto.SecurityPermissionDTO;
import com.techvg.ims.service.dto.SecurityRoleDTO;
import com.techvg.ims.service.dto.SecurityUserDTO;
import com.techvg.ims.service.dto.WareHouseDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SecurityUser} and its DTO {@link SecurityUserDTO}.
 */
@Mapper(componentModel = "spring")
public interface SecurityUserMapper extends EntityMapper<SecurityUserDTO, SecurityUser> {
    @Mapping(target = "securityPermissions", source = "securityPermissions", qualifiedByName = "securityPermissionNameSet")
    @Mapping(target = "securityRoles", source = "securityRoles", qualifiedByName = "securityRoleNameSet")
    @Mapping(target = "wareHouses", source = "wareHouses", qualifiedByName = "wareHouseWhNameSet")
    SecurityUserDTO toDto(SecurityUser s);

    @Mapping(target = "removeSecurityPermission", ignore = true)
    @Mapping(target = "removeSecurityRole", ignore = true)
    @Mapping(target = "removeWareHouse", ignore = true)
    SecurityUser toEntity(SecurityUserDTO securityUserDTO);

    @Named("securityPermissionName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    SecurityPermissionDTO toDtoSecurityPermissionName(SecurityPermission securityPermission);

    @Named("securityPermissionNameSet")
    default Set<SecurityPermissionDTO> toDtoSecurityPermissionNameSet(Set<SecurityPermission> securityPermission) {
        return securityPermission.stream().map(this::toDtoSecurityPermissionName).collect(Collectors.toSet());
    }

    @Named("securityRoleName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    SecurityRoleDTO toDtoSecurityRoleName(SecurityRole securityRole);

    @Named("securityRoleNameSet")
    default Set<SecurityRoleDTO> toDtoSecurityRoleNameSet(Set<SecurityRole> securityRole) {
        return securityRole.stream().map(this::toDtoSecurityRoleName).collect(Collectors.toSet());
    }

    @Named("wareHouseWhName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "whName", source = "whName")
    WareHouseDTO toDtoWareHouseWhName(WareHouse wareHouse);

    @Named("wareHouseWhNameSet")
    default Set<WareHouseDTO> toDtoWareHouseWhNameSet(Set<WareHouse> wareHouse) {
        return wareHouse.stream().map(this::toDtoWareHouseWhName).collect(Collectors.toSet());
    }
}
