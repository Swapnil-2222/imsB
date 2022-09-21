package com.techvg.ims.repository;

import com.techvg.ims.domain.WareHouse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WareHouse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WareHouseRepository extends JpaRepository<WareHouse, Long>, JpaSpecificationExecutor<WareHouse> {}
