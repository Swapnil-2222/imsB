package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.Notification;
import com.techvg.ims.domain.SecurityUser;
import com.techvg.ims.domain.WareHouse;
import com.techvg.ims.service.dto.NotificationDTO;
import com.techvg.ims.service.dto.SecurityUserDTO;
import com.techvg.ims.service.dto.WareHouseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Notification} and its DTO {@link NotificationDTO}.
 */
@Mapper(componentModel = "spring")
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {
    @Mapping(target = "securityUser", source = "securityUser", qualifiedByName = "securityUserLogin")
    @Mapping(target = "wareHouse", source = "wareHouse", qualifiedByName = "wareHouseWhName")
    NotificationDTO toDto(Notification s);

    @Named("securityUserLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    SecurityUserDTO toDtoSecurityUserLogin(SecurityUser securityUser);

    @Named("wareHouseWhName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "whName", source = "whName")
    WareHouseDTO toDtoWareHouseWhName(WareHouse wareHouse);
}
