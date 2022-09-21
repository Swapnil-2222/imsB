package com.techvg.ims.repository;

import com.techvg.ims.domain.ProductInventory;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ProductInventoryRepositoryWithBagRelationshipsImpl implements ProductInventoryRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ProductInventory> fetchBagRelationships(Optional<ProductInventory> productInventory) {
        return productInventory.map(this::fetchWareHouses).map(this::fetchSecurityUsers);
    }

    @Override
    public Page<ProductInventory> fetchBagRelationships(Page<ProductInventory> productInventories) {
        return new PageImpl<>(
            fetchBagRelationships(productInventories.getContent()),
            productInventories.getPageable(),
            productInventories.getTotalElements()
        );
    }

    @Override
    public List<ProductInventory> fetchBagRelationships(List<ProductInventory> productInventories) {
        return Optional.of(productInventories).map(this::fetchWareHouses).map(this::fetchSecurityUsers).orElse(Collections.emptyList());
    }

    ProductInventory fetchWareHouses(ProductInventory result) {
        return entityManager
            .createQuery(
                "select productInventory from ProductInventory productInventory left join fetch productInventory.wareHouses where productInventory is :productInventory",
                ProductInventory.class
            )
            .setParameter("productInventory", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<ProductInventory> fetchWareHouses(List<ProductInventory> productInventories) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, productInventories.size()).forEach(index -> order.put(productInventories.get(index).getId(), index));
        List<ProductInventory> result = entityManager
            .createQuery(
                "select distinct productInventory from ProductInventory productInventory left join fetch productInventory.wareHouses where productInventory in :productInventories",
                ProductInventory.class
            )
            .setParameter("productInventories", productInventories)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    ProductInventory fetchSecurityUsers(ProductInventory result) {
        return entityManager
            .createQuery(
                "select productInventory from ProductInventory productInventory left join fetch productInventory.securityUsers where productInventory is :productInventory",
                ProductInventory.class
            )
            .setParameter("productInventory", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<ProductInventory> fetchSecurityUsers(List<ProductInventory> productInventories) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, productInventories.size()).forEach(index -> order.put(productInventories.get(index).getId(), index));
        List<ProductInventory> result = entityManager
            .createQuery(
                "select distinct productInventory from ProductInventory productInventory left join fetch productInventory.securityUsers where productInventory in :productInventories",
                ProductInventory.class
            )
            .setParameter("productInventories", productInventories)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
