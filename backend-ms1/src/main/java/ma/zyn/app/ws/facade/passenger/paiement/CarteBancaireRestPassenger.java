package  ma.zyn.app.ws.facade.passenger.paiement;

import com.stripe.net.StripeResponse;
import io.swagger.v3.oas.annotations.Operation;

import ma.zyn.app.bean.core.reservation.Reservation;
import ma.zyn.app.service.facade.passenger.reservation.ReservationPassengerService;
import ma.zyn.app.service.impl.passenger.paiement.StripeService;
import ma.zyn.app.ws.dto.reservation.ReservationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import ma.zyn.app.bean.core.paiement.CarteBancaire;
import ma.zyn.app.dao.criteria.core.paiement.CarteBancaireCriteria;
import ma.zyn.app.service.facade.passenger.paiement.CarteBancairePassengerService;
import ma.zyn.app.ws.converter.paiement.CarteBancaireConverter;
import ma.zyn.app.ws.dto.paiement.CarteBancaireDto;
import ma.zyn.app.utils.util.PaginatedList;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/passenger/carteBancaire/")
public class CarteBancaireRestPassenger {




    @Operation(summary = "Finds a list of all carteBancaires")
    @GetMapping("")
    public ResponseEntity<List<CarteBancaireDto>> findAll() throws Exception {
        ResponseEntity<List<CarteBancaireDto>> res = null;
        List<CarteBancaire> list = service.findAll();
        HttpStatus status = HttpStatus.NO_CONTENT;
        List<CarteBancaireDto> dtos  = converter.toDto(list);
        if (dtos != null && !dtos.isEmpty())
            status = HttpStatus.OK;
        res = new ResponseEntity<>(dtos, status);
        return res;
    }

    @Operation(summary = "Payé")
    @PostMapping("/checkout")
    public ResponseEntity<String> checkoutProducts(@RequestBody ReservationDto reservationDto) {
        Long amount = reservationDto.getMontant().longValue();
        String stripeResponse = stripeService.checkOut(amount,reservationDto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(stripeResponse.toString());
    }


    @Operation(summary = "Finds a carteBancaire by id")
    @GetMapping("id/{id}")
    public ResponseEntity<CarteBancaireDto> findById(@PathVariable Long id) {
        CarteBancaire t = service.findById(id);
        if (t != null) {
            CarteBancaireDto dto = converter.toDto(t);
            return getDtoResponseEntity(dto);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }


    @Operation(summary = "Saves the specified  carteBancaire")
    @PostMapping("")
    public ResponseEntity<CarteBancaireDto> save(@RequestBody CarteBancaireDto dto) throws Exception {
        if(dto!=null){
            CarteBancaire myT = converter.toItem(dto);
            CarteBancaire t = service.create(myT);
            if (t == null) {
                return new ResponseEntity<>(null, HttpStatus.IM_USED);
            }else{
                CarteBancaireDto myDto = converter.toDto(t);
                return new ResponseEntity<>(myDto, HttpStatus.CREATED);
            }
        }else {
            return new ResponseEntity<>(dto, HttpStatus.NO_CONTENT);
        }
    }

    @Operation(summary = "Updates the specified  carteBancaire")
    @PutMapping("")
    public ResponseEntity<CarteBancaireDto> update(@RequestBody CarteBancaireDto dto) throws Exception {
        ResponseEntity<CarteBancaireDto> res ;
        if (dto.getId() == null || service.findById(dto.getId()) == null)
            res = new ResponseEntity<>(HttpStatus.CONFLICT);
        else {
            CarteBancaire t = service.findById(dto.getId());
            converter.copy(dto,t);
            CarteBancaire updated = service.update(t);
            CarteBancaireDto myDto = converter.toDto(updated);
            res = new ResponseEntity<>(myDto, HttpStatus.OK);
        }
        return res;
    }

    @Operation(summary = "Delete list of carteBancaire")
    @PostMapping("multiple")
    public ResponseEntity<List<CarteBancaireDto>> delete(@RequestBody List<CarteBancaireDto> dtos) throws Exception {
        ResponseEntity<List<CarteBancaireDto>> res ;
        HttpStatus status = HttpStatus.CONFLICT;
        if (dtos != null && !dtos.isEmpty()) {
            List<CarteBancaire> ts = converter.toItem(dtos);
            service.delete(ts);
            status = HttpStatus.OK;
        }
        res = new ResponseEntity<>(dtos, status);
        return res;
    }

    @Operation(summary = "Delete the specified carteBancaire")
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


    @Operation(summary = "Finds a carteBancaire and associated list by id")
    @GetMapping("detail/id/{id}")
    public ResponseEntity<CarteBancaireDto> findWithAssociatedLists(@PathVariable Long id) {
        CarteBancaire loaded =  service.findWithAssociatedLists(id);
        CarteBancaireDto dto = converter.toDto(loaded);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @Operation(summary = "Finds carteBancaires by criteria")
    @PostMapping("find-by-criteria")
    public ResponseEntity<List<CarteBancaireDto>> findByCriteria(@RequestBody CarteBancaireCriteria criteria) throws Exception {
        ResponseEntity<List<CarteBancaireDto>> res = null;
        List<CarteBancaire> list = service.findByCriteria(criteria);
        HttpStatus status = HttpStatus.NO_CONTENT;
        List<CarteBancaireDto> dtos  = converter.toDto(list);
        if (dtos != null && !dtos.isEmpty())
            status = HttpStatus.OK;

        res = new ResponseEntity<>(dtos, status);
        return res;
    }

    @Operation(summary = "Finds paginated carteBancaires by criteria")
    @PostMapping("find-paginated-by-criteria")
    public ResponseEntity<PaginatedList> findPaginatedByCriteria(@RequestBody CarteBancaireCriteria criteria) throws Exception {
        List<CarteBancaire> list = service.findPaginatedByCriteria(criteria, criteria.getPage(), criteria.getMaxResults(), criteria.getSortOrder(), criteria.getSortField());
        List<CarteBancaireDto> dtos = converter.toDto(list);
        PaginatedList paginatedList = new PaginatedList();
        paginatedList.setList(dtos);
        if (dtos != null && !dtos.isEmpty()) {
            int dateSize = service.getDataSize(criteria);
            paginatedList.setDataSize(dateSize);
        }
        return new ResponseEntity<>(paginatedList, HttpStatus.OK);
    }

    @Operation(summary = "Gets carteBancaire data size by criteria")
    @PostMapping("data-size-by-criteria")
    public ResponseEntity<Integer> getDataSize(@RequestBody CarteBancaireCriteria criteria) throws Exception {
        int count = service.getDataSize(criteria);
        return new ResponseEntity<Integer>(count, HttpStatus.OK);
    }
	
	public List<CarteBancaireDto> findDtos(List<CarteBancaire> list){
        List<CarteBancaireDto> dtos = converter.toDto(list);
        return dtos;
    }

    private ResponseEntity<CarteBancaireDto> getDtoResponseEntity(CarteBancaireDto dto) {
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }




   public CarteBancaireRestPassenger(CarteBancairePassengerService service, CarteBancaireConverter converter){
        this.service = service;
        this.converter = converter;
    }

    private final CarteBancairePassengerService service;
    private final CarteBancaireConverter converter;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private  ReservationPassengerService reservationService;





}
