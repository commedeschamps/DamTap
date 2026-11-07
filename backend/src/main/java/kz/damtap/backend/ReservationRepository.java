package kz.damtap.backend;

import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    @Query("select r from Reservation r join fetch r.offer where r.id = :id and r.customerId = :customerId")
    Optional<Reservation> findOwned(@Param("id") UUID id, @Param("customerId") String customerId);

    @Query("select coalesce(sum(r.quantity), 0) from Reservation r where r.offer.id = :offerId and r.customerId = :customerId")
    long portionsForCustomer(@Param("offerId") String offerId, @Param("customerId") String customerId);
}
