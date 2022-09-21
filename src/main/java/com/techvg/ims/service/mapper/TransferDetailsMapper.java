package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.Product;
import com.techvg.ims.domain.Transfer;
import com.techvg.ims.domain.TransferDetails;
import com.techvg.ims.domain.WareHouse;
import com.techvg.ims.service.dto.ProductDTO;
import com.techvg.ims.service.dto.TransferDTO;
import com.techvg.ims.service.dto.TransferDetailsDTO;
import com.techvg.ims.service.dto.WareHouseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link TransferDetails} and its DTO {@link TransferDetailsDTO}.
 */
@Mapper(componentModel = "spring")
public interface TransferDetailsMapper extends EntityMapper<TransferDetailsDTO, TransferDetails> {
    @Mapping(target = "wareHouse", source = "wareHouse", qualifiedByName = "wareHouseWhName")
    @Mapping(target = "product", source = "product", qualifiedByName = "productId")
    @Mapping(target = "transfer", source = "transfer", qualifiedByName = "transferId")
    TransferDetailsDTO toDto(TransferDetails s);

    @Named("wareHouseWhName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "whName", source = "whName")
    WareHouseDTO toDtoWareHouseWhName(WareHouse wareHouse);

    @Named("productId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProductDTO toDtoProductId(Product product);

    @Named("transferId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TransferDTO toDtoTransferId(Transfer transfer);
}
