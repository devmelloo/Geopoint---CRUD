package br.edu.atitus.geopoint.exception;

public class DuplicatePointNameException extends RuntimeException {
    public DuplicatePointNameException(String name) {
        super("Ja existe um ponto geografico com o nome: " + name);
    }
}
