package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.SecurityUser;
import com.techvg.ims.domain.UserAccess;
import com.techvg.ims.service.dto.SecurityUserDTO;
import com.techvg.ims.service.dto.UserAccessDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserAccess} and its DTO {@link UserAccessDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserAccessMapper extends EntityMapper<UserAccessDTO, UserAccess> {
    @Mapping(target = "securityUser", source = "securityUser", qualifiedByName = "securityUserLogin")
    UserAccessDTO toDto(UserAccess s);

    @Named("securityUserLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    SecurityUserDTO toDtoSecurityUserLogin(SecurityUser securityUser);
}
