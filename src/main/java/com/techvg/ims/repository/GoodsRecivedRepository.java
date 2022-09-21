package com.techvg.ims.repository;

import com.techvg.ims.domain.GoodsRecived;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GoodsRecived entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GoodsRecivedRepository extends JpaRepository<GoodsRecived, Long>, JpaSpecificationExecutor<GoodsRecived> {}
