package kz.damtap.backend;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface PartnerApplicationRepository extends JpaRepository<PartnerApplication, UUID> {
    List<PartnerApplication> findAllByOrderByCreatedAtDesc();
}
