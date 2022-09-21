package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.Product;
import com.techvg.ims.domain.ProductInventory;
import com.techvg.ims.domain.ProductTransaction;
import com.techvg.ims.domain.PurchaseQuotation;
import com.techvg.ims.domain.SecurityUser;
import com.techvg.ims.domain.WareHouse;
import com.techvg.ims.service.dto.ProductDTO;
import com.techvg.ims.service.dto.ProductInventoryDTO;
import com.techvg.ims.service.dto.ProductTransactionDTO;
import com.techvg.ims.service.dto.PurchaseQuotationDTO;
import com.techvg.ims.service.dto.SecurityUserDTO;
import com.techvg.ims.service.dto.WareHouseDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProductInventory} and its DTO {@link ProductInventoryDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductInventoryMapper extends EntityMapper<ProductInventoryDTO, ProductInventory> {
    @Mapping(target = "product", source = "product", qualifiedByName = "productProductName")
    @Mapping(target = "purchaseQuotation", source = "purchaseQuotation", qualifiedByName = "purchaseQuotationId")
    @Mapping(target = "productTransaction", source = "productTransaction", qualifiedByName = "productTransactionId")
    @Mapping(target = "wareHouses", source = "wareHouses", qualifiedByName = "wareHouseWhNameSet")
    @Mapping(target = "securityUsers", source = "securityUsers", qualifiedByName = "securityUserLoginSet")
    ProductInventoryDTO toDto(ProductInventory s);

    @Mapping(target = "removeWareHouse", ignore = true)
    @Mapping(target = "removeSecurityUser", ignore = true)
    ProductInventory toEntity(ProductInventoryDTO productInventoryDTO);

    @Named("productProductName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "productName", source = "productName")
    ProductDTO toDtoProductProductName(Product product);

    @Named("purchaseQuotationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PurchaseQuotationDTO toDtoPurchaseQuotationId(PurchaseQuotation purchaseQuotation);

    @Named("productTransactionId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProductTransactionDTO toDtoProductTransactionId(ProductTransaction productTransaction);

    @Named("wareHouseWhName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "whName", source = "whName")
    WareHouseDTO toDtoWareHouseWhName(WareHouse wareHouse);

    @Named("wareHouseWhNameSet")
    default Set<WareHouseDTO> toDtoWareHouseWhNameSet(Set<WareHouse> wareHouse) {
        return wareHouse.stream().map(this::toDtoWareHouseWhName).collect(Collectors.toSet());
    }

    @Named("securityUserLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    SecurityUserDTO toDtoSecurityUserLogin(SecurityUser securityUser);

    @Named("securityUserLoginSet")
    default Set<SecurityUserDTO> toDtoSecurityUserLoginSet(Set<SecurityUser> securityUser) {
        return securityUser.stream().map(this::toDtoSecurityUserLogin).collect(Collectors.toSet());
    }
}
