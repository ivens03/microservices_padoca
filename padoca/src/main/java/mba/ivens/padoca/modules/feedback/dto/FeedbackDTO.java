package mba.ivens.padoca.modules.feedback.dto;

public record FeedbackDTO(
        String cliente,
        String mensagem,
        Integer avaliacao
) {}
