package com.techvg.ims.service.criteria;

import com.techvg.ims.domain.enumeration.OrderType;
import com.techvg.ims.domain.enumeration.Status;
import java.io.Serializable;
import java.util.Objects;
import org.springdoc.api.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.techvg.ims.domain.PurchaseQuotation} entity. This class is used
 * in {@link com.techvg.ims.web.rest.PurchaseQuotationResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /purchase-quotations?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PurchaseQuotationCriteria implements Serializable, Criteria {

    /**
     * Class for filtering OrderType
     */
    public static class OrderTypeFilter extends Filter<OrderType> {

        public OrderTypeFilter() {}

        public OrderTypeFilter(OrderTypeFilter filter) {
            super(filter);
        }

        @Override
        public OrderTypeFilter copy() {
            return new OrderTypeFilter(this);
        }
    }

    /**
     * Class for filtering Status
     */
    public static class StatusFilter extends Filter<Status> {

        public StatusFilter() {}

        public StatusFilter(StatusFilter filter) {
            super(filter);
        }

        @Override
        public StatusFilter copy() {
            return new StatusFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private DoubleFilter totalPOAmount;

    private DoubleFilter totalGSTAmount;

    private InstantFilter expectedDeliveryDate;

    private InstantFilter poDate;

    private OrderTypeFilter orderType;

    private StatusFilter orderStatus;

    private StringFilter clientName;

    private StringFilter clientMobile;

    private StringFilter clientEmail;

    private StringFilter termsAndCondition;

    private StringFilter notes;

    private StringFilter lastModified;

    private StringFilter lastModifiedBy;

    private StringFilter freeField1;

    private StringFilter freeField2;

    private LongFilter purchaseQuotationDetailsId;

    private LongFilter goodRecivedId;

    private LongFilter securityUserId;

    private LongFilter productInventoryId;

    private Boolean distinct;

    public PurchaseQuotationCriteria() {}

    public PurchaseQuotationCriteria(PurchaseQuotationCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.totalPOAmount = other.totalPOAmount == null ? null : other.totalPOAmount.copy();
        this.totalGSTAmount = other.totalGSTAmount == null ? null : other.totalGSTAmount.copy();
        this.expectedDeliveryDate = other.expectedDeliveryDate == null ? null : other.expectedDeliveryDate.copy();
        this.poDate = other.poDate == null ? null : other.poDate.copy();
        this.orderType = other.orderType == null ? null : other.orderType.copy();
        this.orderStatus = other.orderStatus == null ? null : other.orderStatus.copy();
        this.clientName = other.clientName == null ? null : other.clientName.copy();
        this.clientMobile = other.clientMobile == null ? null : other.clientMobile.copy();
        this.clientEmail = other.clientEmail == null ? null : other.clientEmail.copy();
        this.termsAndCondition = other.termsAndCondition == null ? null : other.termsAndCondition.copy();
        this.notes = other.notes == null ? null : other.notes.copy();
        this.lastModified = other.lastModified == null ? null : other.lastModified.copy();
        this.lastModifiedBy = other.lastModifiedBy == null ? null : other.lastModifiedBy.copy();
        this.freeField1 = other.freeField1 == null ? null : other.freeField1.copy();
        this.freeField2 = other.freeField2 == null ? null : other.freeField2.copy();
        this.purchaseQuotationDetailsId = other.purchaseQuotationDetailsId == null ? null : other.purchaseQuotationDetailsId.copy();
        this.goodRecivedId = other.goodRecivedId == null ? null : other.goodRecivedId.copy();
        this.securityUserId = other.securityUserId == null ? null : other.securityUserId.copy();
        this.productInventoryId = other.productInventoryId == null ? null : other.productInventoryId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public PurchaseQuotationCriteria copy() {
        return new PurchaseQuotationCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public DoubleFilter getTotalPOAmount() {
        return totalPOAmount;
    }

    public DoubleFilter totalPOAmount() {
        if (totalPOAmount == null) {
            totalPOAmount = new DoubleFilter();
        }
        return totalPOAmount;
    }

    public void setTotalPOAmount(DoubleFilter totalPOAmount) {
        this.totalPOAmount = totalPOAmount;
    }

    public DoubleFilter getTotalGSTAmount() {
        return totalGSTAmount;
    }

    public DoubleFilter totalGSTAmount() {
        if (totalGSTAmount == null) {
            totalGSTAmount = new DoubleFilter();
        }
        return totalGSTAmount;
    }

    public void setTotalGSTAmount(DoubleFilter totalGSTAmount) {
        this.totalGSTAmount = totalGSTAmount;
    }

    public InstantFilter getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public InstantFilter expectedDeliveryDate() {
        if (expectedDeliveryDate == null) {
            expectedDeliveryDate = new InstantFilter();
        }
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(InstantFilter expectedDeliveryDate) {
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    public InstantFilter getPoDate() {
        return poDate;
    }

    public InstantFilter poDate() {
        if (poDate == null) {
            poDate = new InstantFilter();
        }
        return poDate;
    }

    public void setPoDate(InstantFilter poDate) {
        this.poDate = poDate;
    }

    public OrderTypeFilter getOrderType() {
        return orderType;
    }

    public OrderTypeFilter orderType() {
        if (orderType == null) {
            orderType = new OrderTypeFilter();
        }
        return orderType;
    }

    public void setOrderType(OrderTypeFilter orderType) {
        this.orderType = orderType;
    }

    public StatusFilter getOrderStatus() {
        return orderStatus;
    }

    public StatusFilter orderStatus() {
        if (orderStatus == null) {
            orderStatus = new StatusFilter();
        }
        return orderStatus;
    }

    public void setOrderStatus(StatusFilter orderStatus) {
        this.orderStatus = orderStatus;
    }

    public StringFilter getClientName() {
        return clientName;
    }

    public StringFilter clientName() {
        if (clientName == null) {
            clientName = new StringFilter();
        }
        return clientName;
    }

    public void setClientName(StringFilter clientName) {
        this.clientName = clientName;
    }

    public StringFilter getClientMobile() {
        return clientMobile;
    }

    public StringFilter clientMobile() {
        if (clientMobile == null) {
            clientMobile = new StringFilter();
        }
        return clientMobile;
    }

    public void setClientMobile(StringFilter clientMobile) {
        this.clientMobile = clientMobile;
    }

    public StringFilter getClientEmail() {
        return clientEmail;
    }

    public StringFilter clientEmail() {
        if (clientEmail == null) {
            clientEmail = new StringFilter();
        }
        return clientEmail;
    }

    public void setClientEmail(StringFilter clientEmail) {
        this.clientEmail = clientEmail;
    }

    public StringFilter getTermsAndCondition() {
        return termsAndCondition;
    }

    public StringFilter termsAndCondition() {
        if (termsAndCondition == null) {
            termsAndCondition = new StringFilter();
        }
        return termsAndCondition;
    }

    public void setTermsAndCondition(StringFilter termsAndCondition) {
        this.termsAndCondition = termsAndCondition;
    }

    public StringFilter getNotes() {
        return notes;
    }

    public StringFilter notes() {
        if (notes == null) {
            notes = new StringFilter();
        }
        return notes;
    }

    public void setNotes(StringFilter notes) {
        this.notes = notes;
    }

    public StringFilter getLastModified() {
        return lastModified;
    }

    public StringFilter lastModified() {
        if (lastModified == null) {
            lastModified = new StringFilter();
        }
        return lastModified;
    }

    public void setLastModified(StringFilter lastModified) {
        this.lastModified = lastModified;
    }

    public StringFilter getLastModifiedBy() {
        return lastModifiedBy;
    }

    public StringFilter lastModifiedBy() {
        if (lastModifiedBy == null) {
            lastModifiedBy = new StringFilter();
        }
        return lastModifiedBy;
    }

    public void setLastModifiedBy(StringFilter lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public StringFilter getFreeField1() {
        return freeField1;
    }

    public StringFilter freeField1() {
        if (freeField1 == null) {
            freeField1 = new StringFilter();
        }
        return freeField1;
    }

    public void setFreeField1(StringFilter freeField1) {
        this.freeField1 = freeField1;
    }

    public StringFilter getFreeField2() {
        return freeField2;
    }

    public StringFilter freeField2() {
        if (freeField2 == null) {
            freeField2 = new StringFilter();
        }
        return freeField2;
    }

    public void setFreeField2(StringFilter freeField2) {
        this.freeField2 = freeField2;
    }

    public LongFilter getPurchaseQuotationDetailsId() {
        return purchaseQuotationDetailsId;
    }

    public LongFilter purchaseQuotationDetailsId() {
        if (purchaseQuotationDetailsId == null) {
            purchaseQuotationDetailsId = new LongFilter();
        }
        return purchaseQuotationDetailsId;
    }

    public void setPurchaseQuotationDetailsId(LongFilter purchaseQuotationDetailsId) {
        this.purchaseQuotationDetailsId = purchaseQuotationDetailsId;
    }

    public LongFilter getGoodRecivedId() {
        return goodRecivedId;
    }

    public LongFilter goodRecivedId() {
        if (goodRecivedId == null) {
            goodRecivedId = new LongFilter();
        }
        return goodRecivedId;
    }

    public void setGoodRecivedId(LongFilter goodRecivedId) {
        this.goodRecivedId = goodRecivedId;
    }

    public LongFilter getSecurityUserId() {
        return securityUserId;
    }

    public LongFilter securityUserId() {
        if (securityUserId == null) {
            securityUserId = new LongFilter();
        }
        return securityUserId;
    }

    public void setSecurityUserId(LongFilter securityUserId) {
        this.securityUserId = securityUserId;
    }

    public LongFilter getProductInventoryId() {
        return productInventoryId;
    }

    public LongFilter productInventoryId() {
        if (productInventoryId == null) {
            productInventoryId = new LongFilter();
        }
        return productInventoryId;
    }

    public void setProductInventoryId(LongFilter productInventoryId) {
        this.productInventoryId = productInventoryId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PurchaseQuotationCriteria that = (PurchaseQuotationCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(totalPOAmount, that.totalPOAmount) &&
            Objects.equals(totalGSTAmount, that.totalGSTAmount) &&
            Objects.equals(expectedDeliveryDate, that.expectedDeliveryDate) &&
            Objects.equals(poDate, that.poDate) &&
            Objects.equals(orderType, that.orderType) &&
            Objects.equals(orderStatus, that.orderStatus) &&
            Objects.equals(clientName, that.clientName) &&
            Objects.equals(clientMobile, that.clientMobile) &&
            Objects.equals(clientEmail, that.clientEmail) &&
            Objects.equals(termsAndCondition, that.termsAndCondition) &&
            Objects.equals(notes, that.notes) &&
            Objects.equals(lastModified, that.lastModified) &&
            Objects.equals(lastModifiedBy, that.lastModifiedBy) &&
            Objects.equals(freeField1, that.freeField1) &&
            Objects.equals(freeField2, that.freeField2) &&
            Objects.equals(purchaseQuotationDetailsId, that.purchaseQuotationDetailsId) &&
            Objects.equals(goodRecivedId, that.goodRecivedId) &&
            Objects.equals(securityUserId, that.securityUserId) &&
            Objects.equals(productInventoryId, that.productInventoryId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            totalPOAmount,
            totalGSTAmount,
            expectedDeliveryDate,
            poDate,
            orderType,
            orderStatus,
            clientName,
            clientMobile,
            clientEmail,
            termsAndCondition,
            notes,
            lastModified,
            lastModifiedBy,
            freeField1,
            freeField2,
            purchaseQuotationDetailsId,
            goodRecivedId,
            securityUserId,
            productInventoryId,
            distinct
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PurchaseQuotationCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (totalPOAmount != null ? "totalPOAmount=" + totalPOAmount + ", " : "") +
            (totalGSTAmount != null ? "totalGSTAmount=" + totalGSTAmount + ", " : "") +
            (expectedDeliveryDate != null ? "expectedDeliveryDate=" + expectedDeliveryDate + ", " : "") +
            (poDate != null ? "poDate=" + poDate + ", " : "") +
            (orderType != null ? "orderType=" + orderType + ", " : "") +
            (orderStatus != null ? "orderStatus=" + orderStatus + ", " : "") +
            (clientName != null ? "clientName=" + clientName + ", " : "") +
            (clientMobile != null ? "clientMobile=" + clientMobile + ", " : "") +
            (clientEmail != null ? "clientEmail=" + clientEmail + ", " : "") +
            (termsAndCondition != null ? "termsAndCondition=" + termsAndCondition + ", " : "") +
            (notes != null ? "notes=" + notes + ", " : "") +
            (lastModified != null ? "lastModified=" + lastModified + ", " : "") +
            (lastModifiedBy != null ? "lastModifiedBy=" + lastModifiedBy + ", " : "") +
            (freeField1 != null ? "freeField1=" + freeField1 + ", " : "") +
            (freeField2 != null ? "freeField2=" + freeField2 + ", " : "") +
            (purchaseQuotationDetailsId != null ? "purchaseQuotationDetailsId=" + purchaseQuotationDetailsId + ", " : "") +
            (goodRecivedId != null ? "goodRecivedId=" + goodRecivedId + ", " : "") +
            (securityUserId != null ? "securityUserId=" + securityUserId + ", " : "") +
            (productInventoryId != null ? "productInventoryId=" + productInventoryId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
