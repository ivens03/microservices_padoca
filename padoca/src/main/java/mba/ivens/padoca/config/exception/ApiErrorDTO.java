package mba.ivens.padoca.config.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorDTO (
        LocalDateTime timestamp,
        Integer status,
        String error,
        String message,
        String path,
        Map<String, String> campos
){
}
