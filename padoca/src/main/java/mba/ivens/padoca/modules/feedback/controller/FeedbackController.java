package mba.ivens.padoca.modules.feedback.controller;

import mba.ivens.padoca.modules.feedback.dto.FeedbackDTO;
import mba.ivens.padoca.modules.feedback.model.Feedback;
import mba.ivens.padoca.modules.feedback.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackRepository repository;

    @PostMapping
    public ResponseEntity<Feedback> enviar(@RequestBody FeedbackDTO dto) {
        Feedback f = new Feedback();
        f.setCliente(dto.cliente());
        f.setMensagem(dto.mensagem());
        f.setAvaliacao(dto.avaliacao());
        return ResponseEntity.ok(repository.save(f));
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }
}
