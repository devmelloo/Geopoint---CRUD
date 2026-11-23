package br.edu.atitus.geopoint.exception;

import java.util.UUID;

public class PointNotFoundException extends RuntimeException {
    public PointNotFoundException(UUID id) {
        super("Ponto geografico nao encontrado para o ID: " + id);
    }
}
