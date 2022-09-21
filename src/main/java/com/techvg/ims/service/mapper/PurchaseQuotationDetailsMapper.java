package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.PurchaseQuotation;
import com.techvg.ims.domain.PurchaseQuotationDetails;
import com.techvg.ims.service.dto.PurchaseQuotationDTO;
import com.techvg.ims.service.dto.PurchaseQuotationDetailsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PurchaseQuotationDetails} and its DTO {@link PurchaseQuotationDetailsDTO}.
 */
@Mapper(componentModel = "spring")
public interface PurchaseQuotationDetailsMapper extends EntityMapper<PurchaseQuotationDetailsDTO, PurchaseQuotationDetails> {
    @Mapping(target = "purchaseQuotation", source = "purchaseQuotation", qualifiedByName = "purchaseQuotationId")
    PurchaseQuotationDetailsDTO toDto(PurchaseQuotationDetails s);

    @Named("purchaseQuotationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PurchaseQuotationDTO toDtoPurchaseQuotationId(PurchaseQuotation purchaseQuotation);
}
