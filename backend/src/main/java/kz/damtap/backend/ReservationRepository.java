package kz.damtap.backend;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface ReservationRepository extends JpaRepository<Reservation, UUID> {}
