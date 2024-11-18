package  ma.zyn.app.ws.facade.admin.message;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import java.util.Arrays;
import java.util.ArrayList;

import ma.zyn.app.bean.core.message.Conversation;
import ma.zyn.app.dao.criteria.core.message.ConversationCriteria;
import ma.zyn.app.service.facade.admin.message.ConversationAdminService;
import ma.zyn.app.ws.converter.message.ConversationConverter;
import ma.zyn.app.ws.dto.message.ConversationDto;
import ma.zyn.app.zynerator.controller.AbstractController;
import ma.zyn.app.zynerator.dto.AuditEntityDto;
import ma.zyn.app.zynerator.util.PaginatedList;


import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import ma.zyn.app.zynerator.process.Result;


import org.springframework.web.multipart.MultipartFile;
import ma.zyn.app.zynerator.dto.FileTempDto;

@RestController
@RequestMapping("/api/admin/conversation/")
public class ConversationRestAdmin {




    @Operation(summary = "Finds a list of all conversations")
    @GetMapping("")
    public ResponseEntity<List<ConversationDto>> findAll() throws Exception {
        ResponseEntity<List<ConversationDto>> res = null;
        List<Conversation> list = service.findAll();
        HttpStatus status = HttpStatus.NO_CONTENT;
            converter.initObject(true);
        List<ConversationDto> dtos  = converter.toDto(list);
        if (dtos != null && !dtos.isEmpty())
            status = HttpStatus.OK;
        res = new ResponseEntity<>(dtos, status);
        return res;
    }

    @Operation(summary = "Finds an optimized list of all conversations")
    @GetMapping("optimized")
    public ResponseEntity<List<ConversationDto>> findAllOptimized() throws Exception {
        ResponseEntity<List<ConversationDto>> res = null;
        List<Conversation> list = service.findAllOptimized();
        HttpStatus status = HttpStatus.NO_CONTENT;
        converter.initObject(true);
        List<ConversationDto> dtos  = converter.toDto(list);
        if (dtos != null && !dtos.isEmpty())
            status = HttpStatus.OK;
        res = new ResponseEntity<>(dtos, status);
        return res;
    }

    @Operation(summary = "Finds a conversation by id")
    @GetMapping("id/{id}")
    public ResponseEntity<ConversationDto> findById(@PathVariable Long id) {
        Conversation t = service.findById(id);
        if (t != null) {
            converter.init(true);
            ConversationDto dto = converter.toDto(t);
            return getDtoResponseEntity(dto);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Finds a conversation by libelle")
    @GetMapping("libelle/{libelle}")
    public ResponseEntity<ConversationDto> findByLibelle(@PathVariable String libelle) {
	    Conversation t = service.findByReferenceEntity(new Conversation(libelle));
        if (t != null) {
            converter.init(true);
            ConversationDto dto = converter.toDto(t);
            return getDtoResponseEntity(dto);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Saves the specified  conversation")
    @PostMapping("")
    public ResponseEntity<ConversationDto> save(@RequestBody ConversationDto dto) throws Exception {
        if(dto!=null){
            converter.init(true);
            Conversation myT = converter.toItem(dto);
            Conversation t = service.create(myT);
            if (t == null) {
                return new ResponseEntity<>(null, HttpStatus.IM_USED);
            }else{
                ConversationDto myDto = converter.toDto(t);
                return new ResponseEntity<>(myDto, HttpStatus.CREATED);
            }
        }else {
            return new ResponseEntity<>(dto, HttpStatus.NO_CONTENT);
        }
    }

    @Operation(summary = "Updates the specified  conversation")
    @PutMapping("")
    public ResponseEntity<ConversationDto> update(@RequestBody ConversationDto dto) throws Exception {
        ResponseEntity<ConversationDto> res ;
        if (dto.getId() == null || service.findById(dto.getId()) == null)
            res = new ResponseEntity<>(HttpStatus.CONFLICT);
        else {
            Conversation t = service.findById(dto.getId());
            converter.copy(dto,t);
            Conversation updated = service.update(t);
            ConversationDto myDto = converter.toDto(updated);
            res = new ResponseEntity<>(myDto, HttpStatus.OK);
        }
        return res;
    }

    @Operation(summary = "Delete list of conversation")
    @PostMapping("multiple")
    public ResponseEntity<List<ConversationDto>> delete(@RequestBody List<ConversationDto> dtos) throws Exception {
        ResponseEntity<List<ConversationDto>> res ;
        HttpStatus status = HttpStatus.CONFLICT;
        if (dtos != null && !dtos.isEmpty()) {
            converter.init(false);
            List<Conversation> ts = converter.toItem(dtos);
            service.delete(ts);
            status = HttpStatus.OK;
        }
        res = new ResponseEntity<>(dtos, status);
        return res;
    }

    @Operation(summary = "Delete the specified conversation")
    @DeleteMapping("id/{id}")
    public ResponseEntity<Long> deleteById(@PathVariable Long id) throws Exception {
        ResponseEntity<Long> res;
        HttpStatus status = HttpStatus.PRECONDITION_FAILED;
        if (id != null) {
            boolean resultDelete = service.deleteById(id);
            if (resultDelete) {
                status = HttpStatus.OK;
            }
        }
        res = new ResponseEntity<>(id, status);
        return res;
    }


    @Operation(summary = "Finds a conversation and associated list by id")
    @GetMapping("detail/id/{id}")
    public ResponseEntity<ConversationDto> findWithAssociatedLists(@PathVariable Long id) {
        Conversation loaded =  service.findWithAssociatedLists(id);
        converter.init(true);
        ConversationDto dto = converter.toDto(loaded);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @Operation(summary = "Finds conversations by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<ConversationDto>> findByCriteria(@RequestBody ConversationCriteria criteria) throws Exception {
        ResponseEntity<List<ConversationDto>> res = null;
        List<Conversation> list = service.findByCriteria(criteria);
        HttpStatus status = HttpStatus.NO_CONTENT;
        converter.initObject(true);
        List<ConversationDto> dtos  = converter.toDto(list);
        if (dtos != null && !dtos.isEmpty())
            status = HttpStatus.OK;

        res = new ResponseEntity<>(dtos, status);
        return res;
    }

    @Operation(summary = "Finds paginated conversations by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody ConversationCriteria criteria) throws Exception {
        List<Conversation> list = service.findPaginatedByCriteria(criteria, criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField());
        converter.initObject(true);
        List<ConversationDto> dtos = converter.toDto(list);
        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(dtos);
        if (dtos != null && !dtos.isEmpty()) {
            int dateSize = service.getDataSize(criteria);
            paginatedList.setDataSize(dateSize);
        }
        return new ResponseEntity<>(paginatedList, HttpStatus.OK);
    }

    @Operation(summary = "Gets conversation data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody ConversationCriteria criteria) throws Exception {
        int count = service.getDataSize(criteria);
        return new ResponseEntity<Integer>(count, HttpStatus.OK);
    }
	
	public List<ConversationDto> findDtos(List<Conversation> list){
        converter.initObject(true);
        List<ConversationDto> dtos = converter.toDto(list);
        return dtos;
    }

    private ResponseEntity<ConversationDto> getDtoResponseEntity(ConversationDto dto) {
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }




   public ConversationRestAdmin(ConversationAdminService service, ConversationConverter converter){
        this.service = service;
        this.converter = converter;
    }

    private final ConversationAdminService service;
    private final ConversationConverter converter;





}
