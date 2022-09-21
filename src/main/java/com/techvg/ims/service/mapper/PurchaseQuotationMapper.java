package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.PurchaseQuotation;
import com.techvg.ims.domain.SecurityUser;
import com.techvg.ims.service.dto.PurchaseQuotationDTO;
import com.techvg.ims.service.dto.SecurityUserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PurchaseQuotation} and its DTO {@link PurchaseQuotationDTO}.
 */
@Mapper(componentModel = "spring")
public interface PurchaseQuotationMapper extends EntityMapper<PurchaseQuotationDTO, PurchaseQuotation> {
    @Mapping(target = "securityUser", source = "securityUser", qualifiedByName = "securityUserLogin")
    PurchaseQuotationDTO toDto(PurchaseQuotation s);

    @Named("securityUserLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    SecurityUserDTO toDtoSecurityUserLogin(SecurityUser securityUser);
}
