package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.Unit;
import com.techvg.ims.service.dto.UnitDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Unit} and its DTO {@link UnitDTO}.
 */
@Mapper(componentModel = "spring")
public interface UnitMapper extends EntityMapper<UnitDTO, Unit> {}
