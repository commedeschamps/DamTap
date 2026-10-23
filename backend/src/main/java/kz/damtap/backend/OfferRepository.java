package kz.damtap.backend;

import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface OfferRepository extends JpaRepository<Offer, String> {
    @Query("select o from Offer o where o.quantityLeft > 0 and o.endsAt > :now order by o.createdAt, o.id")
    List<Offer> findAvailable(@Param("now") Instant now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Offer o where o.id = :id")
    Optional<Offer> findForReservation(@Param("id") String id);
}
