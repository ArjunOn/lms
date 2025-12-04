package com.example.lms.service;

import com.example.lms.entity.Payment;
import com.example.lms.entity.PaymentStatus;
import com.example.lms.entity.Wage;
import com.example.lms.entity.WageStatus;
import com.example.lms.repository.PaymentRepository;
import com.example.lms.repository.WageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private WageRepository wageRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByWageId(Long wageId) {
        return paymentRepository.findByWageId(wageId);
    }

    public List<Payment> getPaymentsByLabourId(Long labourId) {
        return paymentRepository.findByLabourId(labourId);
    }

    public List<Payment> getPaymentsByProjectId(Long projectId) {
        return paymentRepository.findByProjectId(projectId);
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    public List<Payment> getPaymentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findByPaymentDateBetween(startDate, endDate);
    }

    public Double getTotalPaidByLabourId(Long labourId) {
        Double total = paymentRepository.getTotalPaidByLabourId(labourId);
        return total != null ? total : 0.0;
    }

    public Double getTotalPaidByProjectId(Long projectId) {
        Double total = paymentRepository.getTotalPaidByProjectId(projectId);
        return total != null ? total : 0.0;
    }

    @Transactional
    public Payment createPayment(Payment payment) {
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now());
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment updatePayment(Long id, Payment paymentDetails) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        payment.setAmount(paymentDetails.getAmount());
        payment.setPaymentDate(paymentDetails.getPaymentDate());
        payment.setPaymentMethod(paymentDetails.getPaymentMethod());
        payment.setStatus(paymentDetails.getStatus());
        payment.setTransactionReference(paymentDetails.getTransactionReference());
        payment.setNotes(paymentDetails.getNotes());

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment completePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));

        payment.setStatus(PaymentStatus.COMPLETED);
        Payment savedPayment = paymentRepository.save(payment);

        // Update wage status to SETTLED if all payments for this wage are completed
        Wage wage = payment.getWage();
        List<Payment> wagePayments = paymentRepository.findByWageId(wage.getId());
        boolean allCompleted = wagePayments.stream()
                .allMatch(p -> p.getStatus() == PaymentStatus.COMPLETED);

        if (allCompleted) {
            wage.setStatus(WageStatus.SETTLED);
            wage.setSettledDate(LocalDate.now());
            wageRepository.save(wage);
        }

        return savedPayment;
    }

    @Transactional
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
