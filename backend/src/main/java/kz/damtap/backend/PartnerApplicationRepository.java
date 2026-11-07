package kz.damtap.backend;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface PartnerApplicationRepository extends JpaRepository<PartnerApplication, UUID> {
    Optional<PartnerApplication> findFirstByApplicantId(String applicantId);
    Optional<PartnerApplication> findFirstByEmailIgnoreCaseOrderByCreatedAtAsc(String email);
    List<PartnerApplication> findAllByOrderByCreatedAtDesc();
}
