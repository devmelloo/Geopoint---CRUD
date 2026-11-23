package br.edu.atitus.geopoint.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(PointNotFoundException.class)
    public ResponseEntity<ApiError> notFound(PointNotFoundException ex, HttpServletRequest request) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage(), request, Map.of());
    }

    @ExceptionHandler(DuplicatePointNameException.class)
    public ResponseEntity<ApiError> duplicate(DuplicatePointNameException ex, HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage(), request, Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex,
                                                HttpServletRequest request) {
        Map<String, String> details = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            details.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return error(HttpStatus.BAD_REQUEST, "Dados invalidos ou ausentes", request, details);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> invalidJson(HttpMessageNotReadableException ex,
                                                 HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST,
                "JSON invalido, incompleto ou com tipos de dados incorretos", request, Map.of());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> invalidId(MethodArgumentTypeMismatchException ex,
                                               HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, "O ID informado deve ser um UUID valido", request, Map.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> integrity(DataIntegrityViolationException ex,
                                               HttpServletRequest request) {
        return error(HttpStatus.BAD_REQUEST, "Os dados violam uma regra do banco de dados", request, Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> unexpected(Exception ex, HttpServletRequest request) {
        log.error("Erro inesperado na requisicao {} {}", request.getMethod(), request.getRequestURI(), ex);
        return error(HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno inesperado. Tente novamente mais tarde", request, Map.of());
    }

    private ResponseEntity<ApiError> error(HttpStatus status, String message,
                                            HttpServletRequest request, Map<String, String> details) {
        ApiError payload = new ApiError(OffsetDateTime.now(), status.value(),
                status.getReasonPhrase(), message, request.getRequestURI(), details);
        return ResponseEntity.status(status).body(payload);
    }
}
