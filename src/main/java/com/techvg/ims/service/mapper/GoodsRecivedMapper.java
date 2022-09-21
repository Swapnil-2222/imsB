package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.GoodsRecived;
import com.techvg.ims.domain.PurchaseQuotation;
import com.techvg.ims.service.dto.GoodsRecivedDTO;
import com.techvg.ims.service.dto.PurchaseQuotationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GoodsRecived} and its DTO {@link GoodsRecivedDTO}.
 */
@Mapper(componentModel = "spring")
public interface GoodsRecivedMapper extends EntityMapper<GoodsRecivedDTO, GoodsRecived> {
    @Mapping(target = "purchaseQuotation", source = "purchaseQuotation", qualifiedByName = "purchaseQuotationId")
    GoodsRecivedDTO toDto(GoodsRecived s);

    @Named("purchaseQuotationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PurchaseQuotationDTO toDtoPurchaseQuotationId(PurchaseQuotation purchaseQuotation);
}
