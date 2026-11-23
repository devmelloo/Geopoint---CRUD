package br.edu.atitus.geopoint.controller;

import br.edu.atitus.geopoint.dto.PointRequest;
import br.edu.atitus.geopoint.dto.PointResponse;
import br.edu.atitus.geopoint.service.PointService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/points")
public class PointController {

    private final PointService service;

    public PointController(PointService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PointResponse> create(@Valid @RequestBody PointRequest request) {
        PointResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/points/" + response.id())).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PointResponse>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PointResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PointResponse> update(
            @PathVariable UUID id, @Valid @RequestBody PointRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
