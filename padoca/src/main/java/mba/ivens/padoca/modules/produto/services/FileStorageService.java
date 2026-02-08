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
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }

            String nomeArquivo = UUID.randomUUID() + "_" + arquivo.getOriginalFilename();
            Files.copy(arquivo.getInputStream(), this.root.resolve(nomeArquivo));

            return "/uploads/" + nomeArquivo;
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível salvar a imagem: " + e.getMessage());
        }
    }

}
