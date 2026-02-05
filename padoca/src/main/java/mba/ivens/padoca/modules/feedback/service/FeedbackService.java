package mba.ivens.padoca.modules.feedback.service;

import lombok.RequiredArgsConstructor;
import mba.ivens.padoca.modules.feedback.dto.FeedbackDTO;
import mba.ivens.padoca.modules.feedback.model.Feedback;
import mba.ivens.padoca.modules.feedback.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository repository;

    public Feedback salvar(FeedbackDTO dto) {
        Feedback feedback = new Feedback();
        feedback.setCliente(dto.cliente() != null ? dto.cliente() : "Anônimo");
        feedback.setMensagem(dto.mensagem());
        feedback.setAvaliacao(dto.avaliacao());

        return repository.save(feedback);
    }

    public List<Feedback> listarTodos() {
        return repository.findAllByOrderByDataHoraDesc();
    }
}
