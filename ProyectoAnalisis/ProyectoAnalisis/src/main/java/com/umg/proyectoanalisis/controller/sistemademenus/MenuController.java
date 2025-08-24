package com.umg.proyectoanalisis.controller.sistemademenus;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.umg.proyectoanalisis.entity.sistemademenus.Menu;
import com.umg.proyectoanalisis.repository.sistemademenus.MenuRepository;
import com.umg.proyectoanalisis.service.UserRoleOptionsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class MenuController {
    @Autowired
    UserRoleOptionsService userRoleOptionsService;
    @Autowired
    MenuRepository menuRepository;

    @GetMapping("/menus")
    public ResponseEntity<List<Menu>> getMenus() {
        try {
            List<Menu> menus = menuRepository.findAll();
            if (menus.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(menus, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/crear-menu")
    public ResponseEntity<Menu> crearMenu(@RequestBody Menu menu) {
        try {
            if (menu.getNombre() == null || menu.getNombre().isEmpty() ||
                    menu.getOrdenMenu() == null || menu.getModulo() == null) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
            menu.setFechaCreacion(LocalDateTime.now());
            menu.setUsuarioCreacion("Administrador");
            Menu menuGuardado = menuRepository.save(menu);
            return new ResponseEntity<>(menuGuardado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/actualizar-menu")
    public ResponseEntity<Menu> actualizarMenu(@RequestBody Menu menu) {
        try {
            Menu menuExistente = menuRepository.findById(menu.getIdMenu())
                    .orElseThrow(() -> new RuntimeException("Menú no encontrado con id: " + menu.getIdMenu()));
            if (menu.getNombre() == null || menu.getNombre().isEmpty() ||
                    menu.getOrdenMenu() == null || menu.getModulo() == null) {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
            menuExistente.setNombre(menu.getNombre());
            menuExistente.setOrdenMenu(menu.getOrdenMenu());
            menuExistente.setModulo(menu.getModulo());
            menuExistente.setFechaModificacion(LocalDateTime.now());
            menuExistente.setUsuarioModificacion("Administrador");
            Menu menuActualizado = menuRepository.save(menuExistente);
            return new ResponseEntity<>(menuActualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/borrar-menu")
    public ResponseEntity<String> borrarMenu(@RequestParam Integer idMenu) {
        try {
            if (!menuRepository.existsById(idMenu)) {
                return new ResponseEntity<>("Menú no encontrado con id: " + idMenu, HttpStatus.NOT_FOUND);
            }
            menuRepository.deleteById(idMenu);
            return new ResponseEntity<>("Menú eliminado exitosamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el menú", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/opciones")
    public ResponseEntity<List<Map<String, Object>>> getOpciones(@RequestParam String idUsuario) {
        try {
            List<Map<String, Object>> opciones = userRoleOptionsService.obtenerRoleOptions(idUsuario);
            if (opciones.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(opciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Faltan Imprimir y Exportar

}
