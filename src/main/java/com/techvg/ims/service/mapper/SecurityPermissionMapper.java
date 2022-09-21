package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.SecurityPermission;
import com.techvg.ims.service.dto.SecurityPermissionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SecurityPermission} and its DTO {@link SecurityPermissionDTO}.
 */
@Mapper(componentModel = "spring")
public interface SecurityPermissionMapper extends EntityMapper<SecurityPermissionDTO, SecurityPermission> {}
