package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.WareHouse;
import com.techvg.ims.service.dto.WareHouseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link WareHouse} and its DTO {@link WareHouseDTO}.
 */
@Mapper(componentModel = "spring")
public interface WareHouseMapper extends EntityMapper<WareHouseDTO, WareHouse> {}
