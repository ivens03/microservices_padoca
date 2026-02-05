package mba.ivens.padoca.modules.feedback.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cliente;

    private String mensagem;

    private Integer avaliacao;

    private LocalDateTime dataHora = LocalDateTime.now();
}
