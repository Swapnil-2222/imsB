package com.techvg.ims.service.mapper;

import com.techvg.ims.domain.Categories;
import com.techvg.ims.service.dto.CategoriesDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Categories} and its DTO {@link CategoriesDTO}.
 */
@Mapper(componentModel = "spring")
public interface CategoriesMapper extends EntityMapper<CategoriesDTO, Categories> {}
