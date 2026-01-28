package mba.ivens.padoca.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Padoca")
                        .version("1.0.0")
                        .description("API para gerenciamento da Padaria e Mercado Padoca")
                        .contact(new Contact()
                                .name("Suporte Técnico")
                                .email("tech@padoca.com")));
    }
}