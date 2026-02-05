package mba.ivens.padoca.modules.feedback.repository;

import mba.ivens.padoca.modules.feedback.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findAllByOrderByDataHoraDesc();
}