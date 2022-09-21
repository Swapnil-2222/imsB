package com.techvg.ims.service.dto;

import com.techvg.ims.domain.enumeration.NotificationType;
import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.techvg.ims.domain.Notification} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class NotificationDTO implements Serializable {

    private Long id;

    @NotNull
    private String massage;

    private NotificationType notificationType;

    private Boolean isActionRequired;

    private String freeField1;

    private String freeField2;

    @NotNull
    private String lastModified;

    @NotNull
    private String lastModifiedBy;

    private SecurityUserDTO securityUser;

    private WareHouseDTO wareHouse;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMassage() {
        return massage;
    }

    public void setMassage(String massage) {
        this.massage = massage;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public Boolean getIsActionRequired() {
        return isActionRequired;
    }

    public void setIsActionRequired(Boolean isActionRequired) {
        this.isActionRequired = isActionRequired;
    }

    public String getFreeField1() {
        return freeField1;
    }

    public void setFreeField1(String freeField1) {
        this.freeField1 = freeField1;
    }

    public String getFreeField2() {
        return freeField2;
    }

    public void setFreeField2(String freeField2) {
        this.freeField2 = freeField2;
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public SecurityUserDTO getSecurityUser() {
        return securityUser;
    }

    public void setSecurityUser(SecurityUserDTO securityUser) {
        this.securityUser = securityUser;
    }

    public WareHouseDTO getWareHouse() {
        return wareHouse;
    }

    public void setWareHouse(WareHouseDTO wareHouse) {
        this.wareHouse = wareHouse;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NotificationDTO)) {
            return false;
        }

        NotificationDTO notificationDTO = (NotificationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, notificationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NotificationDTO{" +
            "id=" + getId() +
            ", massage='" + getMassage() + "'" +
            ", notificationType='" + getNotificationType() + "'" +
            ", isActionRequired='" + getIsActionRequired() + "'" +
            ", freeField1='" + getFreeField1() + "'" +
            ", freeField2='" + getFreeField2() + "'" +
            ", lastModified='" + getLastModified() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", securityUser=" + getSecurityUser() +
            ", wareHouse=" + getWareHouse() +
            "}";
    }
}
