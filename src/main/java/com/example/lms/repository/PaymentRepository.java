package com.example.lms.repository;

import com.example.lms.entity.Payment;
import com.example.lms.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByWageId(Long wageId);

    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT p FROM Payment p WHERE p.wage.assignment.labour.id = :labourId")
    List<Payment> findByLabourId(Long labourId);

    @Query("SELECT p FROM Payment p WHERE p.wage.assignment.project.id = :projectId")
    List<Payment> findByProjectId(Long projectId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.wage.assignment.labour.id = :labourId")
    Double getTotalPaidByLabourId(Long labourId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.wage.assignment.project.id = :projectId")
    Double getTotalPaidByProjectId(Long projectId);
}
