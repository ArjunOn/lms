package com.example.lms.rest;

import com.example.lms.entity.Payment;
import com.example.lms.entity.PaymentStatus;
import com.example.lms.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentRestController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wage/{wageId}")
    public ResponseEntity<List<Payment>> getPaymentsByWage(@PathVariable Long wageId) {
        return ResponseEntity.ok(paymentService.getPaymentsByWageId(wageId));
    }

    @GetMapping("/labour/{labourId}")
    public ResponseEntity<List<Payment>> getPaymentsByLabour(@PathVariable Long labourId) {
        return ResponseEntity.ok(paymentService.getPaymentsByLabourId(labourId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Payment>> getPaymentsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(paymentService.getPaymentsByProjectId(projectId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Payment>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(paymentService.getPaymentsByDateRange(startDate, endDate));
    }

    @GetMapping("/labour/{labourId}/total")
    public ResponseEntity<Map<String, Double>> getTotalPaidByLabour(@PathVariable Long labourId) {
        Double total = paymentService.getTotalPaidByLabourId(labourId);
        Map<String, Double> response = new HashMap<>();
        response.put("totalPaid", total);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}/total")
    public ResponseEntity<Map<String, Double>> getTotalPaidByProject(@PathVariable Long projectId) {
        Double total = paymentService.getTotalPaidByProjectId(projectId);
        Map<String, Double> response = new HashMap<>();
        response.put("totalPaid", total);
        return ResponseEntity.ok(response);
    }

    @Autowired
    private com.example.lms.repository.WageRepository wageRepository;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody com.example.lms.dto.PaymentRequest request) {
        com.example.lms.entity.Wage wage = wageRepository.findById(request.getWageId())
                .orElseThrow(() -> new RuntimeException("Wage not found with id: " + request.getWageId()));

        Payment payment = new Payment();
        payment.setWage(wage);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getMethod());
        payment.setTransactionReference(request.getTransactionReference());
        payment.setNotes(request.getNotes());
        payment.setStatus(PaymentStatus.COMPLETED); // Assume completed for UI triggered payments

        Payment created = paymentService.createPayment(payment);

        // Also trigger completion logic to update Wage status
        paymentService.completePayment(created.getId());

        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment payment) {
        Payment updated = paymentService.updatePayment(id, payment);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Payment> completePayment(@PathVariable Long id) {
        Payment completed = paymentService.completePayment(id);
        return ResponseEntity.ok(completed);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok().build();
    }
}
