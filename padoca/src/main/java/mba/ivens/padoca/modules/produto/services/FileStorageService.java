package mba.ivens.padoca.modules.produto.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads");

    public String salvarArquivo(MultipartFile arquivo) {
        try {
            // Cria a pasta se não existir
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }

            // Gera um nome único para evitar sobrescrever arquivos com o mesmo nome
            String nomeArquivo = UUID.randomUUID() + "_" + arquivo.getOriginalFilename();
            Files.copy(arquivo.getInputStream(), this.root.resolve(nomeArquivo));

            return "/uploads/" + nomeArquivo; // Retorna o caminho para salvar no banco
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível salvar a imagem: " + e.getMessage());
        }
    }

}
