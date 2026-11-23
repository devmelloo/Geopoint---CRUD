package br.edu.atitus.geopoint.entity;

import java.math.BigDecimal;
import java.util.UUID;

public record Point(
        UUID id,
        String name,
        String description,
        BigDecimal latitude,
        BigDecimal longitude
) { }
