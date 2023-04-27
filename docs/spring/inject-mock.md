TODO
# InjectMock

```
@ExtendWith(MockitoExtension::class)
class TosspaymentsServiceTest {
    private lateinit var tosspaymentsService: TosspaymentsService

    @Mock
    private lateinit var paymentRepository: PaymentRepository

    @Mock
    private lateinit var tossVirtualAccountCashReceiptRepository: TossVirtualAccountCashReceiptRepository

    @Mock
    private lateinit var tossCancelRepository: TossCancelRepository

    @Mock
    private lateinit var tossReceiptRepository: TossReceiptRepository

    @Mock
    private lateinit var httpResponse: HttpResponse<String>

    private val payment = mock(Payment::class.java)
    private val reservation = mock(Reservation::class.java)
    private val orderId = ""
    private val tossPaymentKey = ""

    @BeforeEach
    fun init() {
        tosspaymentsService = TosspaymentsService(
            apiServer = "https://api.tosspayments.com",
            apiKey = "",
            paymentRepository = paymentRepository,
            tossVirtualAccountCashReceiptRepository = tossVirtualAccountCashReceiptRepository,
            tossCancelRepository = tossCancelRepository,
            tossReceiptRepository = tossReceiptRepository
        )
    }
}
```