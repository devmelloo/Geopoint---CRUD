package br.edu.atitus.geopoint.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/** O construtor compacto remove os espacos ANTES da validacao do Bean Validation. */
public record PointRequest(
        @NotBlank(message = "O nome e obrigatorio")
        @Size(max = 100, message = "O nome deve ter no maximo 100 caracteres")
        String name,

        @Size(max = 255, message = "A descricao deve ter no maximo 255 caracteres")
        String description,

        @NotNull(message = "A latitude e obrigatoria")
        @DecimalMin(value = "-90", message = "A latitude deve ser maior ou igual a -90")
        @DecimalMax(value = "90", message = "A latitude deve ser menor ou igual a 90")
        BigDecimal latitude,

        @NotNull(message = "A longitude e obrigatoria")
        @DecimalMin(value = "-180", message = "A longitude deve ser maior ou igual a -180")
        @DecimalMax(value = "180", message = "A longitude deve ser menor ou igual a 180")
        BigDecimal longitude
) {
    public PointRequest {
        name = name == null ? null : name.trim();
        description = description == null ? null : description.trim();
    }
}
